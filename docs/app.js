var colorPicker = new iro.ColorPicker('#picker');
var swatchGrid = document.getElementById('swatch-grid');
var selector = document.getElementById("color-models-select");
var colorRectangle = document.getElementById("color-rectangle");

var rgbColorText = document.getElementById("rgbColor");
var cmykColorText = document.getElementById("cmykColor");
var hlsColorText = document.getElementById("hlsColor");

var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
var input3 = document.getElementById("input3");
var input4 = document.getElementById("input4");

var label1 = document.getElementById("label1");
var label2 = document.getElementById("label2");
var label3 = document.getElementById("label3");
var label4 = document.getElementById("label4");

var updateColorLabels = (rgb, cmyk, hls) => {
  showRgbValue(rgb);
  showCmykValue(cmyk);
  showHlsValue(hls);
  colorRectangle.style.backgroundColor = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
}

colorPicker.on(['color:init', 'input:change'], function (color) {
  let cmyk = rgbToCmyk(color.rgb.r, color.rgb.g, color.rgb.b);
  let hls = rgbToHls(color.rgb.r, color.rgb.g, color.rgb.b);
  updateColorLabels(color.rgb, cmyk, hls);
  
  switch (selector.selectedIndex) {
    case 0:
      setRgbInput(color.rgb);
      break;
    case 1:
      setCmykInput(cmyk);
      break;
    case 2:
      setHlsInput(hls);
      break;
  }
});

swatchGrid.addEventListener('click', function (e) {
  var clickTarget = e.target;
  // read data-color attribute
  if (clickTarget.dataset.color) {
    // update the color picker
    colorPicker.color.set(clickTarget.dataset.color);
    colorPicker.emit('input:change', new iro.Color(clickTarget.dataset.color));
  }
});

function onSelectedColorModelChanged() {
  let rgb = colorPicker.color.rgb;
  switch (selector.selectedIndex) {
    case 0:
      label1.innerHTML = "R:";
      label2.innerHTML = "G:";
      label3.innerHTML = "B:";
      label4.innerHTML = "";
      setRgbRestrictions();
      setRgbInput(rgb);
      showRgbValue(rgb);
      break;
    case 1:
      label1.innerHTML = "C:";
      label2.innerHTML = "M:";
      label3.innerHTML = "Y:";
      label4.innerHTML = "K:";
      setCmykRestrictions();
      let cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setCmykInput(cmyk);
      showCmykValue(cmyk);
      break;
    case 2:
      label1.innerHTML = "H:";
      label2.innerHTML = "L:";
      label3.innerHTML = "S:";
      label4.innerHTML = "";
      setHlsRestrictions();
      let hls = rgbToHls(rgb.r, rgb.g, rgb.b);
      setHlsInput(hls);
      showHlsValue(hls);
      break;
  }
}

function onInputChanged(inputField) {
  if (inputField.value == "") {
    setUndefined();
    return;
  }
  let isInputValid;
  switch (selector.selectedIndex) {
    case 0:
      let rgb = readRgbFromInput();
      isInputValid = checkRangeRgb(rgb);
      if (isInputValid) {
        colorPicker.color.set(rgb);
        //var color = new iro.Color(rgb);
        //colorPicker.emit('color:change', color);
        let cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        let hls = rgbToHls(rgb.r, rgb.g, rgb.b);
        updateColorLabels(rgb, cmyk, hls);
        //setRgbInput(rgb);
        //showRgbValue(rgb);
      }
      break;
    case 1:
      let cmyk = readCmykFromInput();
      isInputValid = checkRangeCmyk(cmyk);
      if (isInputValid) {
        let rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
        let hls = rgbToHls(rgb.r, rgb.g, rgb.b);
        colorPicker.color.set(rgb);
        updateColorLabels(rgb, cmyk, hls);
      }
      break;
    case 2:
      let hls = readHlsFromInput();
      isInputValid = checkRangeHls(hls);
      if (isInputValid) {
        let rgb = hlsToRgb(hls.h, hls.l, hls.s);
        let cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        colorPicker.color.set(rgb);
        updateColorLabels(rgb, cmyk, hls);
      }
      break;
  }
  if (!isInputValid) {
    setUndefined();
  }
}

function checkRangeRgb(rgb) {
  let isValid = rgb.r >= 0 && rgb.r <= 255;
  isValid = isValid && rgb.g >= 0 && rgb.g <= 255;
  isValid = isValid && rgb.b >= 0 && rgb.b <= 255;
  return isValid;
}

function checkRangeCmyk(cmyk) {
  let isValid = cmyk.c >= 0 && cmyk.c <= 1;
  isValid = isValid && cmyk.m >= 0 && cmyk.m <= 1;
  isValid = isValid && cmyk.y >= 0 && cmyk.y <= 1;
  isValid = isValid && cmyk.k >= 0 && cmyk.k <= 1;
  return isValid;
}

function checkRangeHls(hls) {
  let isValid = hls.h >= 0 && hls.h <= 360;
  isValid = isValid && hls.l >= 0 && hls.l <= 1;
  isValid = isValid && hls.s >= 0 && hls.s <= 1;
  return isValid;
}

function setUndefined() {
  rgbColorText.textContent = "undefined";
  cmykColorText.textContent = "undefined";
  hlsColorText.textContent = "undefined";
}

function setRgbRestrictions() {
  input4.value = "";
  input4.disabled = true;
  input1.min = 0;
  input1.max = 255;
  input1.step = 1;
  input2.min = 0;
  input2.max = 255;
  input2.step = 1;
  input3.min = 0;
  input3.max = 255;
  input3.step = 1;
}
function setCmykRestrictions() {
  input4.disabled = false;
  input1.min = 0;
  input1.max = 1;
  input1.step = 0.01;
  input2.min = 0;
  input2.max = 1;
  input2.step = 0.01;
  input3.min = 0;
  input3.max = 1;
  input3.step = 0.01;
  input4.min = 0;
  input4.max = 1;
  input4.step = 0.01;
}
function setHlsRestrictions() {
  input4.value = "";
  input4.disabled = true;
  input1.min = 0;
  input1.max = 360;
  input1.step = 1;
  input2.min = 0;
  input2.max = 1;
  input2.step = 0.01;
  input3.min = 0;
  input3.max = 1;
  input3.step = 0.01;
}

function showRgbValue(rgb) {
  rgbColorText.textContent = "(R: " + Math.round(rgb.r) + ", G: " + Math.round(rgb.g) + ", B: " + Math.round(rgb.b) + ")";
}

function showCmykValue(cmyk) {
  let c = Math.round(cmyk.c * 100) / 100;
  let m = Math.round(cmyk.m * 100) / 100;
  let y = Math.round(cmyk.y * 100) / 100;
  let k = Math.round(cmyk.k * 100) / 100;
  cmykColorText.textContent = "(C: " + c + ", M: " + m + ", Y: " + y + ", K: " + k + ")";
}

function showHlsValue(hls) {
  let h = Math.round(hls.h);
  let l = Math.round(hls.l * 100) / 100;
  let s = Math.round(hls.s * 100) / 100;
  hlsColorText.textContent = "(H: " + h + ", L: " + l + ", S: " + s + ")";
}

function setRgbInput(rgb) {
  input1.value = rgb.r;
  input2.value = rgb.g;
  input3.value = rgb.b;
}

function setCmykInput(cmyk) {
  input1.value = cmyk.c;
  input2.value = cmyk.m;
  input3.value = cmyk.y;
  input4.value = cmyk.k;
}

function setHlsInput(hls) {
  input1.value = hls.h;
  input2.value = hls.l;
  input3.value = hls.s;
}

function readRgbFromInput() {
  return {
    r: parseFloat(input1.value),
    g: parseFloat(input2.value),
    b: parseFloat(input3.value)
  };
}

function readCmykFromInput() {
  return {
    c: parseFloat(input1.value),
    m: parseFloat(input2.value),
    y: parseFloat(input3.value),
    k: parseFloat(input4.value)
  };
}

function readHlsFromInput() {
  return {
    h: parseFloat(input1.value),
    l: parseFloat(input2.value),
    s: parseFloat(input3.value)
  };
}

function rgbToCmyk(r, g, b) {
  var cmyk = {};
  cmyk.k = Math.round(Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255) * 100) / 100;
  if (cmyk.k == 1) {
    cmyk.c = 0;
    cmyk.m = 0;
    cmyk.y = 0;
  } else {
    cmyk.c = Math.round((1 - r / 255 - cmyk.k) / (1 - cmyk.k) * 100) / 100;
    cmyk.c = cmyk.c >= 0 ? cmyk.c : 0;
    cmyk.m = Math.round((1 - g / 255 - cmyk.k) / (1 - cmyk.k) * 100) / 100;
    cmyk.m = cmyk.m >= 0 ? cmyk.m : 0;
    cmyk.y = Math.round((1 - b / 255 - cmyk.k) / (1 - cmyk.k) * 100) / 100;
    cmyk.y = cmyk.y >= 0 ? cmyk.y : 0;

  }
  return cmyk;
}

function cmykToRgb(c, m, y, k) {
  var rgb = {};
  rgb.r = Math.round(255 * (1 - c) * (1 - k));
  rgb.g = Math.round(255 * (1 - m) * (1 - k));
  rgb.b = Math.round(255 * (1 - y) * (1 - k));
  return rgb;
}

function rgbToHls(r, g, b) {
  var hls = {};
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  hls.l = 0.5 * (max + min);
  if (hls.l == 0 || max == min) {
    hls.s = 0;
  } else if (hls.l > 0 && hls.l <= 0.5) {
    hls.s = (max - min) / (max + min);
  } else {
    hls.s = (max - min) / (2 - max - min);
  }

  hls.l = Math.round(hls.l * 100) / 100;
  hls.s = Math.round(hls.s * 100) / 100;

  if (max == min) {
    hls.h = 0;
  } else if (max == r && g >= b) {
    hls.h = 60 * (g - b) / (max - min);
  } else if (max == r && g < b) {
    hls.h = 60 * (g - b) / (max - min) + 360;
  } else if (max == g) {
    hls.h = 60 * (b - r) / (max - min) + 120;
  } else if (max == b) {
    hls.h = 60 * (r - g) / (max - min) + 240;
  }
  hls.h = Math.round(hls.h);

  return hls;
}

function hlsToRgb(h, l, s) {
  var q = 0;
  if (l < 0.5) {
    q = l + l * s;
  } else {
    q = l + s - l * s;
  }
  var p = 2 * l - q;
  h = h / 360;
  var t = [h + 1 / 3, h, h - 1 / 3];
  for (let i = 0; i < 3; i++) {
    if (t[i] < 0) {
      t[i]++;
    }
    if (t[i] > 1) {
      t[i]--;
    }
  }
  var rgbValues = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    if (t[i] < 1 / 6) {
      rgbValues[i] = p + (q - p) * 6 * t[i];
    } else if (t[i] >= 1 / 6 && t[i] < 0.5) {
      rgbValues[i] = q;
    } else if (t[i] >= 0.5 && t[i] < 2 / 3) {
      rgbValues[i] = p + (q - p) * (2 / 3 - t[i]) * 6;
    } else {
      rgbValues[i] = p;
    }
  }
  var rgb = {
    r: Math.round(rgbValues[0] * 255),
    g: Math.round(rgbValues[1] * 255),
    b: Math.round(rgbValues[2] * 255)
  };
  return rgb;
}
