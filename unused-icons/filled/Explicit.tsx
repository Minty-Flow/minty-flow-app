import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExplicit = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zm-5 4h-4a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1 -1l-.007 -.117a1 1 0 0 0 -.993 -.883h-3v-2h3a1 1 0 0 0 0 -2h-3v-2h3a1 1 0 0 0 0 -2" />
  </Svg>
);
export default SvgExplicit;
