import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVocabulary = (props: SvgProps) => (
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
    <Path d="M10 19h-6a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2" />
    <Path d="M12 5v16" />
    <Path d="M7 7h1" />
    <Path d="M7 11h1" />
    <Path d="M16 7h1" />
    <Path d="M16 11h1" />
    <Path d="M16 15h1" />
  </Svg>
);
export default SvgVocabulary;
