const themeStyles = {
  dark: {
    background: 'bg-[#0F0F1C]', // dark navy background
    card: 'bg-[#1C1C2E]/90 border-[#2D2D40]/60',
    input: 'bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:ring-purple-500',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
      muted: 'text-gray-500'
    },
    decorativeOrbs: {
      first: 'bg-purple-600/30',
      second: 'bg-pink-500/30',
      third: 'bg-indigo-500/30'
    },
    divider: 'border-[#2E2E3A]',
    dividerBg: 'bg-[#1A1A2E]'
  },
  light: {
    background: 'bg-gradient-to-br from-white via-slate-400 to-white',
    card: 'bg-white/90 border-slate-200/70',
    input: 'bg-slate-50 border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500'
    },
    decorativeOrbs: {
      first: 'bg-purple-200/30',
      second: 'bg-pink-200/30',
      third: 'bg-blue-200/30'
    },
    divider: 'border-slate-300',
    dividerBg: 'bg-white'
  }
};
