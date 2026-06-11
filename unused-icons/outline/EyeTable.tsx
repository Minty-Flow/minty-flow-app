import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeTable = (props: SvgProps) => (
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
    <Path d="M8 18h-.011" />
    <Path d="M12 18h-.011" />
    <Path d="M16 18h-.011" />
    <Path d="M4 3h16" />
    <Path d="M5 3v17a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-17" />
    <Path d="M14 7h-4" />
    <Path d="M9 15h1" />
    <Path d="M14 15h1" />
    <Path d="M12 11v-4" />
  </Svg>
);
export default SvgEyeTable;
