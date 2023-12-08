const latitude = 40.4406;
const longitude = -79.9959;

function TimeSinceMidnight(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const timeInDecimal = hours / 24 + minutes / 1440 + seconds / 86400;
  return timeInDecimal;
}

function dateToJulian(date) {
  const julianDayAtEpoch = 2440587.5;
  const timeSinceEpoch = date.getTime();
  const julianDate = julianDayAtEpoch + timeSinceEpoch / (24 * 60 * 60 * 1000);
  return julianDate;
}

function JulianCentury(JulianDay) {
  const century = (JulianDay - 2451545) / 36525;
  return century;
}

function GeomMeanLongSun(julianCentury) {
  const temp =
    280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032);
  return temp % 360;
}

function GeomMeanAnomSun(julianCentury) {
  const temp =
    357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  return temp;
}

function EccentEarthOrbit(julianCentury) {
  const temp =
    0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);
  return temp;
}

function SunEqOfCenter(julianCentury, geomMeanAnomSun) {
  const temp =
    Math.sin((Math.PI / 180) * geomMeanAnomSun) *
      (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
    Math.sin((Math.PI / 180) * 2 * geomMeanAnomSun) *
      (0.019993 - 0.000101 * julianCentury) +
    Math.sin((Math.PI / 180) * 3 * geomMeanAnomSun) * 0.000289;

  return temp;
}

function SunTrueLong(geomMeanLongSun, sunEqOfCenter) {
  return geomMeanLongSun + sunEqOfCenter;
}

function SunTrueAnom(geomMeanAnomSun, sunEqOfCenter) {
  return geomMeanAnomSun + sunEqOfCenter;
}

function SunRadVector(eccentEarthOrbit, sunTrueAnom) {
  return (
    (1.000001018 * (1 - eccentEarthOrbit * eccentEarthOrbit)) /
    (1 + eccentEarthOrbit * Math.cos((Math.PI / 180) * sunTrueAnom))
  );
}

function SunAppLong(sunTrueLong, julianCentury) {
  return (
    sunTrueLong -
    0.00569 -
    0.00478 * Math.sin((Math.PI / 180) * 125.04 - 1934.136 * julianCentury)
  );
}

function MeanObliqueEcliptic(julianCentury) {
  return (
    23 +
    (26 +
      (21.448 -
        julianCentury *
          (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) /
        60) /
      60
  );
}

function ObliqueCorr(meanObliqueEcliptic, julianCentury) {
  return (
    meanObliqueEcliptic +
    0.00256 * Math.cos((Math.PI / 180) * 125.04 - 1934.136 * julianCentury)
  );
}

function SunRightAsc(sunAppLong, obliqueCorr) {
  const radiansP2 = (Math.PI / 180) * sunAppLong;
  const radiansR2 = (Math.PI / 180) * obliqueCorr;
  const secondArg = Math.cos(radiansR2) * Math.sin(radiansP2);
  const result = Math.atan2(secondArg, Math.cos(radiansP2));
  const resultDegrees = (180 / Math.PI) * result;

  return resultDegrees;
}

function SunDecl(sunAppLong, obliqueCorr) {
  const temp = Math.asin(
    Math.sin((Math.PI / 180) * obliqueCorr) *
      Math.sin((Math.PI / 180) * sunAppLong)
  );
  return (180 / Math.PI) * temp;
}

function VarY(obliqueCorr) {
  return (
    Math.tan(((Math.PI / 180) * obliqueCorr) / 2) *
    Math.tan(((Math.PI / 180) * obliqueCorr) / 2)
  );
}

function EqOfTime(geomMeanAnomSun, geomMeanLongSun, eccentEarthOrbit, varY) {
  const temp =
    varY * Math.sin(((2 * Math.PI) / 180) * geomMeanLongSun) -
    2 * eccentEarthOrbit * Math.sin((Math.PI / 180) * geomMeanAnomSun) +
    4 *
      eccentEarthOrbit *
      varY *
      Math.sin((Math.PI / 180) * geomMeanAnomSun) *
      Math.cos(
        ((2 * Math.PI) / 180) * geomMeanLongSun -
          0.5 *
            varY *
            varY *
            Math.sin(((4 * Math.PI) / 180) * geomMeanLongSun) -
          1.25 *
            eccentEarthOrbit *
            eccentEarthOrbit *
            Math.sin(((2 * Math.PI) / 180) * geomMeanAnomSun)
      );
  return ((4 * 180) / Math.PI) * temp;
}

function HaSunrise(lat, sunDecl) {
  const numerator = Math.cos((Math.PI / 180.0) * 90.833);
  const denominator =
    Math.cos((Math.PI / 180.0) * lat) * Math.cos((Math.PI / 180.0) * sunDecl);
  const d2 =
    Math.tan((Math.PI / 180.0) * lat) * Math.tan((Math.PI / 180.0) * sunDecl);
  const temp = Math.acos(numerator / denominator - d2);

  return (temp * 180) / Math.PI;
}

function SolarNoon(long, eqOfTime, timeoffset) {
  return (720 - 4 * long - eqOfTime + timeoffset * 60) / 1440;
}

function SunriseTime(solarNoon, haSunrise) {
  return solarNoon - (haSunrise * 4) / 1440;
}

function SunsetTime(solarNoon, haSunrise) {
  return solarNoon + (haSunrise * 4) / 1440;
}

// Minutes
function SunlightDuration(haSunrise) {
  return 8 * haSunrise;
}

//Minutes
function TrueSolarTime(timeSinceMidnight, eqOfTime, long, timeoffset) {
  return (
    (timeSinceMidnight * 1440 + eqOfTime + 4 * long - 60 * timeoffset) % 1440
  );
}

// Degrees
function HourAngle(trueSolarTime) {
  if (trueSolarTime / 4 < 0) {
    return trueSolarTime / 4 + 180;
  } else {
    return trueSolarTime / 4 - 180;
  }
}

function SolarZenithAngle(lat, sunDecl, hourAngle) {
  const temp = Math.acos(
    Math.sin((Math.PI / 180.0) * lat) * Math.sin((Math.PI / 180.0) * sunDecl) +
      Math.cos((Math.PI / 180.0) * lat) *
        Math.cos((Math.PI / 180.0) * sunDecl) *
        Math.cos((Math.PI / 180.0) * hourAngle)
  );
  return (180.0 / Math.PI) * temp;
}

function SolarElevationAngle(solarZenithAngle) {
  return 90 - solarZenithAngle;
}

function AtmosphericRefraction(solarElevationAngle) {
  if (solarElevationAngle > 85) {
    return 0;
  } else if (solarElevationAngle > 5) {
    return (
      (58.1 / Math.tan((Math.PI / 180.0) * solarElevationAngle) -
        0.07 / Math.pow(Math.tan((Math.PI / 180.0) * solarElevationAngle), 3) +
        0.000086 /
          Math.pow(Math.tan((Math.PI / 180.0) * solarElevationAngle), 5)) /
      3600
    );
  } else if (solarElevationAngle > -0.575) {
    return (
      (1735 +
        solarElevationAngle *
          (-518.2 +
            solarElevationAngle *
              (103.4 +
                solarElevationAngle *
                  (-12.79 + solarElevationAngle * 0.711)))) /
      3600
    );
  } else {
    return -20.772 / Math.tan((Math.PI / 180.0) * solarElevationAngle) / 3600;
  }
}

function ElevationAngleWithRefrac(solarElevationAngle, atmosphericRefraction) {
  return solarElevationAngle + atmosphericRefraction;
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getCurrentDateAtMidnight() {
  // Get the current date
  const currentDate = new Date();

  // Set the time to midnight (00:00:00)
  currentDate.setHours(0, 0, 0, 0);

  return currentDate.getTime();
}

function decimalTimeToMilliseconds(decimalTime) {
  if (
    typeof decimalTime !== "number" ||
    isNaN(decimalTime) ||
    decimalTime < 0 ||
    decimalTime > 1
  ) {
    return "Invalid input";
  }
  const totalMilliseconds = decimalTime * 24 * 60 * 60 * 1000;
  return totalMilliseconds;
}

function decimalToMillisecondsSinceMidnight(decimalTime) {
  return getCurrentDateAtMidnight() + decimalTimeToMilliseconds(decimalTime);
}

function SolarData(date) {
  const timeoffset = -5;
  const julianDay = dateToJulian(date);
  const julianCentury = JulianCentury(julianDay);
  const geomMeanLongSun = GeomMeanLongSun(julianCentury);
  const geomMeanAnomSun = GeomMeanAnomSun(julianCentury);
  const eccentEarthOrbit = EccentEarthOrbit(julianCentury);
  const sunEqOfCenter = SunEqOfCenter(julianCentury, geomMeanAnomSun);
  const sunTrueLong = SunTrueLong(geomMeanLongSun, sunEqOfCenter);
  const sunTrueAnom = SunTrueAnom(geomMeanAnomSun, sunEqOfCenter);
  const sunRadVector = SunRadVector(eccentEarthOrbit, sunTrueAnom);
  const sunAppLong = SunAppLong(sunTrueLong, julianCentury);
  const meanObliqueEcliptic = MeanObliqueEcliptic(julianCentury);
  const obliqueCorr = ObliqueCorr(meanObliqueEcliptic, julianCentury);
  const sunRightAsc = SunRightAsc(sunAppLong, obliqueCorr);
  const sunDecl = SunDecl(sunAppLong, obliqueCorr);
  const varY = VarY(obliqueCorr);
  const eqOfTime = EqOfTime(
    geomMeanAnomSun,
    geomMeanLongSun,
    eccentEarthOrbit,
    varY
  );
  const haSunrise = HaSunrise(latitude, sunDecl);
  const solarNoon = SolarNoon(longitude, eqOfTime, timeoffset);
  const sunriseTime = SunriseTime(solarNoon, haSunrise);
  const sunsetTime = SunsetTime(solarNoon, haSunrise);
  const sunlightDuration = SunlightDuration(haSunrise);
  const timeSinceMidnight = TimeSinceMidnight(date);
  const trueSolarTime = TrueSolarTime(
    timeSinceMidnight,
    eqOfTime,
    longitude,
    timeoffset
  );
  const hourAngle = HourAngle(trueSolarTime);
  const solarZenithAngle = SolarZenithAngle(latitude, sunDecl, hourAngle);
  const solarElevationAngle = SolarElevationAngle(solarZenithAngle);
  const atmosphericRefraction = AtmosphericRefraction(solarElevationAngle);
  const elevationAngleWithRefrac = ElevationAngleWithRefrac(
    solarElevationAngle,
    atmosphericRefraction
  );

  return {
    solarElevationAngle: solarElevationAngle,
    sunriseTime: sunriseTime,
    sunsetTime: sunsetTime,
    solarNoon: solarNoon,
  };
}

function GatherSolarData() {
  const now = new Date();
  const solarData = {
    chart_input: [],
    sunrise: 0,
    sunset: 0,
    solar_noon: 0,
    sunrise_milliseconds: 0,
    sunset_milliseconds: 0,
  };
  for (var i = 1; i < 24; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i);

    const calculations = SolarData(date);

    const item = {
      x: formatDateTime(date),
      y: calculations.solarElevationAngle,
    };
    solarData.chart_input.push(item);
    solarData.sunrise = calculations.sunriseTime;
    solarData.sunset = calculations.sunsetTime;
    solarData.solar_noon = calculations.solarNoon;
    solarData.sunrise_milliseconds = decimalToMillisecondsSinceMidnight(
      calculations.sunriseTime
    );
    solarData.sunset_milliseconds = decimalToMillisecondsSinceMidnight(
      calculations.sunsetTime
    );
    solarData.noon_milliseconds = decimalToMillisecondsSinceMidnight(
      calculations.solarNoon
    );

    solarData.elevationAngle = calculations.solarElevationAngle;
  }
  console.log(solarData.noon_milliseconds);
  const noon = new Date(solarData.noon_milliseconds);
  console.log(noon);
  const noonData = SolarData(noon);
  solarData.noonElevationAngle = noonData.solarElevationAngle;
  const currentTime = new Date();
  const currentData = SolarData(currentTime);
  solarData.current_time = currentTime.getTime();
  solarData.currentElevationAngle = currentData.solarElevationAngle;
  console.log(solarData);
  return solarData;
}

export default GatherSolarData;
export { SolarData };
