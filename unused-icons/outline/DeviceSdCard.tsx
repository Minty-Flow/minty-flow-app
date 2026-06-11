import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceSdCard = (props: SvgProps) => (
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
    <Path d="M7 21h10a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-6.172a2 2 0 0 0 -1.414 .586l-3.828 3.828a2 2 0 0 0 -.586 1.414v10.172a2 2 0 0 0 2 2" />
    <Path d="M13 6v2" />
    <Path d="M16 6v2" />
    <Path d="M10 7v1" />
  </Svg>
);
export default SvgDeviceSdCard;
