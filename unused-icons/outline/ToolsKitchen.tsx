import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToolsKitchen = (props: SvgProps) => (
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
    <Path d="M4 3h8l-1 9h-6l-1 -9" />
    <Path d="M7 18h2v3h-2l0 -3" />
    <Path d="M20 3v12h-5c-.023 -3.681 .184 -7.406 5 -12" />
    <Path d="M20 15v6h-1v-3" />
    <Path d="M8 12l0 6" />
  </Svg>
);
export default SvgToolsKitchen;
