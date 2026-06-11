import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFolderOff = (props: SvgProps) => (
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
    <Path d="M8 4h1l3 3h7a2 2 0 0 1 2 2v8m-2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 1.189 -1.829" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFolderOff;
