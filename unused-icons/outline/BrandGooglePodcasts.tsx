import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGooglePodcasts = (props: SvgProps) => (
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
    <Path d="M12 3v2" />
    <Path d="M12 19v2" />
    <Path d="M12 8v8" />
    <Path d="M8 17v2" />
    <Path d="M4 11v2" />
    <Path d="M20 11v2" />
    <Path d="M8 5v8" />
    <Path d="M16 7v-2" />
    <Path d="M16 19v-8" />
  </Svg>
);
export default SvgBrandGooglePodcasts;
