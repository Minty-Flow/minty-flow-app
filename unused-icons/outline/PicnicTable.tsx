import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPicnicTable = (props: SvgProps) => (
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
    <Path d="M16 7l2 9m-10 -9l-2 9m-1 -9h14m2 5h-18" />
  </Svg>
);
export default SvgPicnicTable;
