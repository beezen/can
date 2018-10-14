/* eslint-disable */
let device = {};

let userAgent = window.navigator.userAgent.toLowerCase();

let find = (needle) => {
  return userAgent.indexOf(needle) !== -1;
};

device.isIphoneX = () => {
  return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
}

device.ios = () => {
  return device.iphone() || device.ipod() || device.ipad();
};

device.iphone = () => {
  return !device.windows() && find('iphone');
};

device.ipod = () => {
  return find('ipod');
};

device.ipad = () => {
  return find('ipad');
};

device.android = () => {
  return !device.windows() && find('android');
};

device.androidPhone = () => {
  return device.android() && find('mobile');
};

device.androidTablet = () => {
  return device.android() && !find('mobile');
};

device.blackberry = () => {
  return find('blackberry') || find('bb10') || find('rim');
};

device.blackberryPhone = () => {
  return device.blackberry() && !find('tablet');
};

device.blackberryTablet = () => {
  return device.blackberry() && find('tablet');
};

device.windows = () => {
  return find('windows');
};

device.windowsPhone = () => {
  return device.windows() && find('phone');
};

device.windowsTablet = () => {
  return device.windows() && (find('touch') && !device.windowsPhone());
};

device.fxos = () => {
  return (find('(mobile;') || find('(tablet;')) && find('; rv:');
};

device.fxosPhone = () => {
  return device.fxos() && find('mobile');
};

device.fxosTablet = () => {
  return device.fxos() && find('tablet');
};

device.meego = () => {
  return find('meego');
};

device.cordova = () => {
  return window.cordova && location.protocol === 'file:';
};

device.nodeWebkit = () => {
  return typeof window.process === 'object';
};

device.mobile = () => {
  return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
};

device.tablet = () => {
  return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
};

device.desktop = () => {
  return !device.tablet() && !device.mobile();
};

device.television = () => {
  let television = [
    'googletv',
    'viera',
    'smarttv',
    'internet.tv',
    'netcast',
    'nettv',
    'appletv',
    'boxee',
    'kylo',
    'roku',
    'dlnadoc',
    'roku',
    'pov_tv',
    'hbbtv',
    'ce-html'
  ];

  let i = 0;
  while (i < television.length) {
    if (find(television[i])) {
      return true;
    }
    i++;
  }
  return false;
};

device.portrait = () => {
  return (window.innerHeight / window.innerWidth) > 1;
};

device.landscape = () => {
  return (window.innerHeight / window.innerWidth) < 1;
};

/**
 * 判断设备类型
 * @example if(device.ios() === true){}
 */
export default device;