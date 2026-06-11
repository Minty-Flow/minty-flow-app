import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCreativeCommonsNc = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M15 9h-4.5a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4.5" />
    <Path d="M12 7v2" />
    <Path d="M12 15v2" />
    <Path d="M6 6l3 3" />
    <Path d="M15 15l3 3" />
  </Svg>
);
export default SvgCreativeCommonsNc;
