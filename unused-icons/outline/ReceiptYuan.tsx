import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReceiptYuan = (props: SvgProps) => (
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
    <Path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
    <Path d="M9 12h6" />
    <Path d="M9 7l3 4.5" />
    <Path d="M15 7l-3 4.5v4.5" />
  </Svg>
);
export default SvgReceiptYuan;
