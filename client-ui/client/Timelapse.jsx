Timelapse = React.createClass({
    displayName: "Timelapse",
    getInitialState: function() {
        return {
          isMoving: false,
          timelapse: "",
          px: "",
          py: "",
          onPointerDownPointerX: 0,
          onPointerDownPointerY: 0,
          hyperlapseOption: {
            //lookat: mapItem.markers.lookAtPoint.getPosition(),
            fov: 80,
            millis: 50,
            width: 2048,//window.innerWidth,
            height: 1024,//window.innerHeight,
            zoom: 2,
            use_lookat: true,
            distance_between_points: 20,
            max_points: 100,
            elevation: 0
          },
          isLoaded: false
        }
    },
    handleController: function(controllerItem){
      var controlKey = Object.keys(controllerItem)

      switch(controlKey[0]){
        case 'isPlaying':
          this.handlePlayPause(controllerItem);
          break;
        case 'frame':
          this.handleNextPrev(controllerItem);
          break;
        case 'useLookAt':
          this.handleUseLookAtPoint(controllerItem);
          break;
        case 'speedFactor':
          this.handleChangeSpeedFactor(controllerItem);
          break;
        // case 'distancePoints':
        //   this.handleChangeDistancePoints(controllerItem);
        //   break;
        case 'changeOffsetX':
          this.handleChangeOffsetX(controllerItem);
          break;
        case 'changeOffsetY':
          this.handleChangeOffsetY(controllerItem);
          break;
        case 'changeOffsetZ':
          this.handleChangeOffsetZ(controllerItem);
          break;
        case 'rotateCameraView':
          this.handleChangeTilt(controllerItem);
          break;
        case 'zoomCameraView':
          this.handleChangeFOV(controllerItem);
          break;
        default:
          console.log(controllerItem);
          break;
      }
    },
    createHyperlapse: function(mapItem) {
      var panorama = document.getElementById('panorama');
      this.state.hyperlapseOption.lookat = mapItem.markers.lookAtPoint.getPosition();

      $.getScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.js").done(function(a,b){
          var hyperlapse = new Hyperlapse(panorama, this.state.hyperlapseOption);

          hyperlapse.onError = function(e) {
            ReactDOM.render(<VideoLoader progress={"ERROR: "+ e.message}/>,
            document.getElementById('controller'));
    			};

          hyperlapse.onRouteProgress = function(e) {
            var dotMarker = new google.maps.Marker({
              position: e.point.location,
              draggable: false,
              icon:'/images/dot_marker.png'
            });
            dotMarker.setMap(mapItem.map);

            ReactDOM.render(<VideoLoader progress={'Generating Route..'}/>,
            document.getElementById('controller'));
    			};

    			hyperlapse.onRouteComplete = function(e) {
            mapItem.directionsRenderer.setDirections(e.response);
            ReactDOM.render(<VideoLoader
              length={hyperlapse.length()}
              value={0}
              progress={'Generating Timelapse Video..'}
              />,
            document.getElementById('controller'));
    				hyperlapse.load();
    			}.bind(this);

          hyperlapse.onLoadProgress = function(e) {
            ReactDOM.render(<VideoLoader
              length={hyperlapse.length()}
              value={e.position+1}
              progress={'Generating Timelapse Video..'}
              />, document.getElementById('controller'));
    			}.bind(this);

          hyperlapse.onLoadComplete = function(e) {
            ReactDOM.render(<VideoPlayer option={this.state.hyperlapseOption} onControl={this.handleController}/>,
            document.getElementById('controller'));
          }.bind(this);

    			hyperlapse.onFrame = function(e) {
            mapItem.markers.cameraPinPoint.setPosition(e.point.location);
          };

          hyperlapse.generate({route:mapItem.route});
          this.setState({timelapse: hyperlapse});
      }.bind(this));
    },

    handlePlayPause: function(){
      var hyperlapse = this.state.timelapse;

      if(hyperlapse.isPlaying()){
        hyperlapse.pause()
      }
      else{
        hyperlapse.play()
      }

      this.setState({timelapse: hyperlapse});
    },

    handleNextPrev: function(controllerItem){
      var hyperlapse = this.state.timelapse;
      if(!hyperlapse.isPlaying()){
        (controllerItem['frame'] == 'next' ?
          hyperlapse.next() : hyperlapse.prev()
        )
      }

      this.setState({timelapse: hyperlapse});
    },

    handleUseLookAtPoint: function(){
      var lookat = this.state.hyperlapseOption.use_lookat;

      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['use_lookat'] = !lookat;

      var hyperlapse = this.state.timelapse;
      hyperlapse.use_lookat = !lookat;

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleChangeSpeedFactor: function(controllerItem){
      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['millis'] = controllerItem['speedFactor'];

      var hyperlapse = this.state.timelapse;
      hyperlapse['millis'] = controllerItem['speedFactor'];

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    // handleChangeDistancePoints: function(controllerItem){
    //   var hyperlapseOpt = this.state.hyperlapseOption;
    //   hyperlapseOpt['distancePoints'] = controllerItem['distancePoints'];
    //
    //   var hyperlapse = this.state.timelapse;
    //   hyperlapse.setDistanceBetweenPoint(controllerItem['distancePoints']);
    //
    //   this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    // },

    handleChangeOffsetX: function(controllerItem){ //
      var hyperlapseOpt = this.state.hyperlapseOption;

      hyperlapseOpt['offsetX'] = controllerItem['changeOffsetX'];

      var hyperlapse = this.state.timelapse;
      hyperlapse['offset']['x'] = controllerItem['changeOffsetX'];

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleChangeOffsetY: function(controllerItem){ //
      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['offsetY'] = controllerItem['changeOffsetY'];

      var hyperlapse = this.state.timelapse;
      hyperlapse['offset']['y'] = controllerItem['changeOffsetY'];

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleChangeOffsetZ: function(controllerItem){ //
      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['offsetZ'] = controllerItem['changeOffsetZ'];

      var hyperlapse = this.state.timelapse;
      hyperlapse['offset']['z'] = controllerItem['changeOffsetZ'];

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleChangeTilt: function(controllerItem){ //
      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['tilt'] = controllerItem['rotateCameraView'];

      var hyperlapse = this.state.timelapse;
      hyperlapse['tilt'] = controllerItem['rotateCameraView'];

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleChangeFOV: function(controllerItem){
      var hyperlapseOpt = this.state.hyperlapseOption;
      hyperlapseOpt['fov'] = controllerItem['zoomCameraView'];

      var hyperlapse = this.state.timelapse;
      hyperlapse.setFOV(controllerItem['zoomCameraView']);

      this.setState({hyperlapseOption: hyperlapseOpt, timelapse: hyperlapse});
    },

    handleMouseDown: function(e){
      e.preventDefault();

      var hyperlapse = this.state.timelapse
      this.setState({
        isMoving: true,
        onPointerDownPointerX: e.clientX,
        onPointerDownPointerY: e.clientY,
        px: hyperlapse.position.x,
        py: hyperlapse.position.y
      });
    },

    handleMouseMove: function(e){
      e.preventDefault();
      var hyperlapse = this.state.timelapse;
      var f = hyperlapse.fov() / 500;

      if(this.state.isMoving) {
        var dx = ( this.state.onPointerDownPointerX - e.clientX ) * f;
        var dy = ( e.clientY - this.state.onPointerDownPointerY ) * f;
        hyperlapse.position.x = this.state.px + dx; // reversed dragging direction (thanks @mrdoob!)
        hyperlapse.position.y = this.state.py + dy;
        this.setState({timelapse: hyperlapse});

        // o.position_x = hyperlapse.position.x;
        // o.position_y = hyperlapse.position.y;
      }
    },

    handleMouseUp: function(e){
      var hyperlapse = this.state.timelapse;
      hyperlapse.position.x = this.state.px;
      hyperlapse.position.y = this.state.py;
      this.setState({
        isMoving: false,
        timelapse: hyperlapse
      });
    },
    componentWillReceiveProps: function(nextProps){
      if(nextProps.trigger == "map"){
        this.createHyperlapse(nextProps.mapItem);
      }
    },
    render() {
      return <div
        id="panorama"
        refs="panorama"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ></div>
    }
});
