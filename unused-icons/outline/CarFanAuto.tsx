import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCarFanAuto = (props: SvgProps) => (
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
    <Path d="M12 12v-9l4.912 1.914a1.7 1.7 0 0 1 .428 2.925l-5.34 4.161" />
    <Path d="M14.044 14.624l-2.044 -2.624h4" />
    <Path d="M12 12h-9l1.914 -4.912a1.7 1.7 0 0 1 2.925 -.428l4.161 5.34" />
    <Path d="M12 12v9l-4.912 -1.914a1.7 1.7 0 0 1 -.428 -2.925l5.34 -4.161" />
    <Path d="M17 21v-4a2 2 0 1 1 4 0v4" />
    <Path d="M17 19h4" />
  </Svg>
);
export default SvgCarFanAuto;
