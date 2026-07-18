import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgRoulette = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M10.586 10.586l-1.586 -1.586" />
    <Path d="M13.414 10.586l1.586 -1.586" />
    <Path d="M13.414 13.414l1.586 1.586" />
    <Path d="M10.586 13.414l-1.586 1.586" />
    <Path d="M14 12a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M16.5 4.206l-.5 .866" />
    <Path d="M7.5 19.794l.5 -.866" />
    <Path d="M19.794 7.5l-.866 .5" />
    <Path d="M4.206 16.5l.866 -.5" />
    <Path d="M7.5 4.206l.5 .866" />
    <Path d="M16.5 19.794l-.5 -.866" />
    <Path d="M4.206 7.5l.866 .5" />
    <Path d="M19.794 16.5l-.866 -.5" />
    <Path d="M12 3v1" />
    <Path d="M12 21v-1" />
    <Path d="M21 12h-1" />
    <Path d="M3 12h1" />
    <Path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" />
  </Svg>
);
export default SvgRoulette;
