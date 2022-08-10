import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables, defaults } from 'chart.js'
Chart.register(...registerables)

function LineChart ({
  trackVector,
  userTrackVector,
  userPlaylistName,
  playlistName
}) {
  defaults.plugins.title.color = 'rgb(0,0,0)'
  defaults.plugins.tooltip.enabled = true

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 15,
            family: 'Poppins',
            weight: 500
          }
        }
      },
      title: {
        display: true,
        text: 'Audio Feature Comparison',
        font: {
          size: 30,
          family: 'Poppins',
          weight: 500
        }
      }
    }

  }

  const data = {
    labels: Object.keys(trackVector),
    datasets: [{
      label: playlistName,
      data: Object.values(trackVector),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: userPlaylistName,
      data: Object.values(userTrackVector),
      borderColor: 'rgb(103, 122, 200)',
      backgroundColor: 'rgba(95, 119, 224, 0.5)'
    }
    ]
  }

  return (
    <Line
      options={options}
      data={data}
    />
  )
}

export default LineChart
