import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgDeviceWorkstation = (props: SvgProps) => (
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
    <Path d="M7.07 20l-4.84 -4.617a.79 .79 0 0 1 -.065 -1.041l2.835 -3.342" />
    <Path d="M9 20h-5" />
    <Path d="M6.398 8.063l-1.302 -.896a.95 .95 0 0 0 -1.318 .245l-.611 .889a.95 .95 0 0 0 .245 1.318l1.302 .896c1.041 .716 .635 3.505 2.735 4.949l4.551 -6.62c-2.067 -1.42 -4.559 -.065 -5.602 -.781" />
    <Path d="M9 4h10a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-7" />
    <Path d="M13 20h4" />
    <Path d="M15 16v4" />
  </Svg>
);
export default SvgDeviceWorkstation;
