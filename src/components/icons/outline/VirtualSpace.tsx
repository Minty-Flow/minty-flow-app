import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgVirtualSpace = (props: SvgProps) => (
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
    <Path d="M16 14.808a25 25 0 0 0 -4 -.312c-1.439 0 -2.796 .113 -4 .312" />
    <Path d="M21 17.439c0 1.148 -2.034 2.142 -4.997 2.625l-.003 -10.439c2.965 -.482 5 -1.477 5 -2.625v-.064c0 -1.622 -4.03 -2.936 -9 -2.936s-9 1.314 -9 2.936c0 1.148 2.035 2.142 5 2.624l-.003 10.44c-2.963 -.483 -4.997 -1.477 -4.997 -2.625" />
    <Path d="M3 6.936v10.439" />
    <Path d="M21 6.936v10.439" />
  </Svg>
);
export default SvgVirtualSpace;
