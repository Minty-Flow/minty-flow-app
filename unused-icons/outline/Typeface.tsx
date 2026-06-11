import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTypeface = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M17 17a2 2 0 0 1 -2 -2v-8h-5a2 2 0 0 0 -2 2" />
    <Path d="M7 17a2.775 2.775 0 0 0 2.632 -1.897l.368 -1.103a13.4 13.4 0 0 1 3.236 -5.236l1.764 -1.764" />
    <Path d="M10 14h5" />
  </Svg>
);
export default SvgTypeface;
