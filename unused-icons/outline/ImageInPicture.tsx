import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgImageInPicture = (props: SvgProps) => (
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
    <Path d="M13 15c-2 0 -5 1 -5 5" />
    <Path d="M4 13a2 2 0 0 1 2 -2h5a2 2 0 0 1 2 2v5a2 2 0 0 1 -2 2h-5a2 2 0 0 1 -2 -2l0 -5" />
    <Path d="M4 7v-2a1 1 0 0 1 1 -1h2" />
    <Path d="M11 4h2" />
    <Path d="M17 4h2a1 1 0 0 1 1 1v2" />
    <Path d="M20 11v2" />
    <Path d="M20 17v2a1 1 0 0 1 -1 1h-2" />
  </Svg>
);
export default SvgImageInPicture;
