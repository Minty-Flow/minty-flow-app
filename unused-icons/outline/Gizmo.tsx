import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGizmo = (props: SvgProps) => (
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
    <Path d="M20 19l-8 -5.5l-8 5.5" />
    <Path d="M12 4v9.5" />
    <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M19 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgGizmo;
