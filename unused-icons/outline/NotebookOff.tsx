import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNotebookOff = (props: SvgProps) => (
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
    <Path d="M8 4h9a2 2 0 0 1 2 2v9m-.179 3.828a2 2 0 0 1 -1.821 1.172h-11a1 1 0 0 1 -1 -1v-14m4 -1v1m0 4v13" />
    <Path d="M13 8h2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgNotebookOff;
