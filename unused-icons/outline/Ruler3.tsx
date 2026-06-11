import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRuler3 = (props: SvgProps) => (
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
    <Path d="M19.875 8c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75" />
    <Path d="M9 8v2" />
    <Path d="M6 8v3" />
    <Path d="M12 8v3" />
    <Path d="M18 8v3" />
    <Path d="M15 8v2" />
  </Svg>
);
export default SvgRuler3;
