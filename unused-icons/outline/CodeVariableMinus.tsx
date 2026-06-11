import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCodeVariableMinus = (props: SvgProps) => (
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
    <Path d="M12.5 16h-6.5a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
    <Path d="M16 18h6" />
  </Svg>
);
export default SvgCodeVariableMinus;
