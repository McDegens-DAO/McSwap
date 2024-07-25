$(window).on('load', function() {
  
  if(conf.vanta == "WAVES"){
    VANTA.WAVES({
      el: "body",
      mouseControls: conf.vanta_mouseControls,
      touchControls: conf.vanta_touchControls,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: conf.vanta_color,
      shininess: conf.vanta_shininess,
      waveHeight: conf.vanta_waveHeight,
      waveSpeed: conf.vanta_waveSpeed,
    });
  }
  if(conf.vanta == "TOPOLOGY"){
    VANTA.TOPOLOGY({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xb0ff,
      backgroundColor: 0x93fa
    });
  }
  if(conf.vanta == "CELLS"){
    VANTA.CELLS({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      color1: 0x555555,
      color2: 0x848484,
      size: 3.90,
      speed: 0.00
    });
  }
  if(conf.vanta == "CLOUDS2"){
    VANTA.CLOUDS2({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      texturePath: "/img/noise.png"
    });
  }
  if(conf.vanta == "FOG"){
    VANTA.FOG({
      el: "body",
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0x202020,
      midtoneColor: 0x3e3e3e,
      lowlightColor: 0x2d2d2d,
      baseColor: 0x0,
      blurFactor: 0.47,
      speed: 0.40,
      zoom: 0.50
    });
  }
  
});