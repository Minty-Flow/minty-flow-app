import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgDevice3DLens = (props: SvgProps) => (
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
    <Path d="M18.005 14.64a3.98 3.98 0 0 0 .995 -2.64" />
    <Path d="M12 4v16" />
    <Path d="M15 5v14a7 7 0 0 0 0 -14" />
    <Path d="M9 5v14a7 7 0 0 1 0 -14" />
  </Svg>
);
export default SvgDevice3DLens;
