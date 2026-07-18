import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgNoiseReduction = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M10.01 18h-.01" />
    <Path d="M14.01 14h-.01" />
    <Path d="M16.01 12h-.01" />
    <Path d="M18.01 10h-.01" />
    <Path d="M16.01 16h-.01" />
    <Path d="M14.01 18h-.01" />
    <Path d="M18.01 14h-.01" />
    <Path d="M12.01 16h-.01" />
  </Svg>
);
export default SvgNoiseReduction;
