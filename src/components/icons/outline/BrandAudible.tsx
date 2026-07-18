import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgBrandAudible = (props: SvgProps) => (
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
    <Path d="M18.46 9.75a9 9 0 0 0 -12.92 0" />
    <Path d="M14.34 11.58a5 5 0 0 0 -4.68 0" />
    <Path d="M22 13l-10 4l-10 -4" />
  </Svg>
);
export default SvgBrandAudible;
