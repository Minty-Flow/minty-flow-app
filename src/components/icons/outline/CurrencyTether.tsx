import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCurrencyTether = (props: SvgProps) => (
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
    <Path d="M4 11a8 2 0 1 0 16 0a8 2 0 1 0 -16 0" />
    <Path d="M12 20v-16" />
    <Path d="M4 4h16" />
  </Svg>
);
export default SvgCurrencyTether;
