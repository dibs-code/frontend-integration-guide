module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        body: '#090333',
        dimGray: '#B8B6CB',
        pink: '#ED00C9',
        purple: '#BD00ED',
        left: '#1D023B',
        right: '#17023E',
        green: '#26fffe',
        blue: '#0000AF',
        success: '#55a361',
        error: '#cf3a41',
        warn: '#edb831',
        info: '#006cff',
        placeholder: '#757384',
      },
      fontSize: {
        22: '22px',
      },
      screens: {
        sm: '600px',
        mdLg: '960px',
        xxxl: '1920px',
      },
      boxShadow: {
        box: '0 0 45px #4E0042',
      },
      backgroundOpacity: {
        45: '0.45',
      },
    },
  },
  plugins: [],
}
