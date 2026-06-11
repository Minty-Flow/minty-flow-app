import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGif = (props: SvgProps) => (
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
    <Path d="M8 8h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2v-4h-1" />
    <Path d="M12 8v8" />
    <Path d="M16 12h3" />
    <Path d="M20 8h-4v8" />
  </Svg>
);
export default SvgGif;
