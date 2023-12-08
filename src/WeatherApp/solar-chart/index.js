import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import annotationPlugin from "chartjs-plugin-annotation";
import "./index.css";
import GatherSolarData from "./SolarLibrary";
import SolarData from "./SolarLibrary";
Chart.register(annotationPlugin);

function decimalTimeToClock(decimalTime) {
  if (
    typeof decimalTime !== "number" ||
    isNaN(decimalTime) ||
    decimalTime < 0 ||
    decimalTime > 1
  ) {
    return "Invalid input";
  }
  const totalMinutes = decimalTime * 24 * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const suffix = hours < 12 ? " am" : " pm";
  const clockHours = hours > 12 ? hours - 12 : hours;

  const formattedTime = `${clockHours}:${String(minutes).padStart(
    2,
    "0"
  )}${suffix}`;

  return formattedTime;
}

function formatDayLength(decimalTime) {
  if (decimalTime < 0) {
    const formattedTime = `${0}:${String(0).padStart(2, "0")}`;
    return formattedTime;
  }
  if (
    typeof decimalTime !== "number" ||
    isNaN(decimalTime) ||
    decimalTime > 1
  ) {
    return "Invalid input";
  }

  const totalMinutes = decimalTime * 24 * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const formattedTime = `${hours}:${String(minutes).padStart(2, "0")}`;

  return formattedTime;
}

function dateToText(inputDate) {
  if (!(inputDate instanceof Date) || isNaN(inputDate)) {
    return "Invalid date";
  }

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = dayNames[inputDate.getDay()];
  const month = monthNames[inputDate.getMonth()];
  const dayOfMonth = inputDate.getDate();

  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
  return formattedDate;
}

const SolarChart = () => {
  useEffect(() => {
    const solarPositionData = GatherSolarData();
    const sunriseClockTime = decimalTimeToClock(solarPositionData.sunrise);
    const sunsetClockTime = decimalTimeToClock(solarPositionData.sunset);
    const noonClockTime = decimalTimeToClock(solarPositionData.solar_noon);
    const dayLength = solarPositionData.sunset - solarPositionData.sunrise;
    const rightNow = new Date();
    const midnightTime = new Date();
    midnightTime.setHours(0, 0, 0, 0);
    const decimalRightNow =
      (rightNow.getTime() - midnightTime.getTime()) / 86400000;
    const daylightRemaining = solarPositionData.sunset - decimalRightNow;
    console.log(daylightRemaining);
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);

    const formattedData = solarPositionData.chart_input.map((point) => ({
      x: new Date(point.x),
      y: point.y,
    }));

    const legendAnnotation1 = {
      type: "label",
      xValue: noon.getTime(),
      yValue: -40,
      backgroundColor: "transparent",
      content: [dateToText(noon)],
      color: "#FFFFFF",
      font: {
        size: 14,
      },
    };

    const legendAnnotation2 = {
      type: "label",
      xValue: noon.getTime(),
      yValue: -60,
      backgroundColor: "transparent",
      content: [
        `Day Length: ${formatDayLength(dayLength)}`,
        `Daylight Remaining: ${formatDayLength(daylightRemaining)}`,
      ],
      color: "#FFFFFF",
      font: {
        size: 10,
      },
    };

    const sunriseAnnotation = {
      type: "point",
      xValue: solarPositionData.sunrise_milliseconds,
      yValue: 0,
      backgroundColor: "rgba(243, 156, 18, 0.33)",
      radius: 6,
    };

    const sunriseTextAnnotation = {
      type: "label",
      xValue: solarPositionData.sunrise_milliseconds,
      yValue: 0,
      xAdjust: -50,
      yAdjust: -10,
      backgroundColor: "transparent",
      content: [sunriseClockTime],
      color: "#FFFFFF",
      font: {
        size: 10,
      },
    };

    const sunsetAnnotation = {
      type: "point",
      xValue: solarPositionData.sunset_milliseconds,
      yValue: 0,
      backgroundColor: "rgba(243, 156, 18, 0.33)",
      radius: 6,
    };

    const sunsetTextAnnotation = {
      type: "label",
      xValue: solarPositionData.sunset_milliseconds,
      yValue: 0,
      xAdjust: 50,
      yAdjust: -10,
      backgroundColor: "transparent",
      content: [sunsetClockTime],
      font: {
        size: 10,
      },
      color: "#FFFFFF",
    };

    const solarNoonAnnotation = {
      type: "point",
      xValue: solarPositionData.noon_milliseconds,
      yValue: solarPositionData.noonElevationAngle,
      backgroundColor: "rgba(242, 194, 9, 0.4)",
      radius: 6,
    };

    const noonTextAnnotation = {
      type: "label",
      xValue: solarPositionData.noon_milliseconds,
      yValue: solarPositionData.noonElevationAngle,
      xAdjust: 0,
      yAdjust: -12,
      backgroundColor: "transparent",
      content: [noonClockTime],
      color: "#FFFFFF",
      font: {
        size: 10,
      },
    };

    const currentAnnotation = {
      type: "point",
      xValue: solarPositionData.current_time,
      yValue: solarPositionData.currentElevationAngle,
      backgroundColor: "rgba(242, 194, 9, 1)",
      radius: 10,
    };

    const ctx = document.getElementById("solarPositionChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Solar Position",
            data: formattedData,
            borderColor: "#3498db",
            backgroundColor: "#2D2D34",
            pointRadius: 0,
            pointBackgroundColor: "#3498db",
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "#3498db",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
              displayFormats: {
                hour: "HH:mm",
              },
            },
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            grace: "5%",
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
          },
          customCanvasBackgroundColor: {
            color: "lightGreen",
          },
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y",
                value: 0,
                borderColor: "gray",
                borderWidth: 1,
                label: {
                  content: "My Horizontal Line",
                  enabled: true,
                },
              },
              sunriseAnnotation,
              sunsetAnnotation,
              solarNoonAnnotation,
              currentAnnotation,
              sunriseTextAnnotation,
              sunsetTextAnnotation,
              noonTextAnnotation,
              legendAnnotation1,
              legendAnnotation2,
            ],
          },
        },

        elements: {
          line: {
            tension: 0.3,
          },
        },
        maintainAspectRatio: true,
      },
    });
  }, []);

  return (
    <div className="chart-container">
      <canvas id="solarPositionChart"></canvas>
    </div>
  );
};

export default SolarChart;
