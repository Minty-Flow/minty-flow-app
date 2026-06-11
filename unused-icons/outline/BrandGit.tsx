import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGit = (props: SvgProps) => (
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
    <Path d="M15 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M12 15v-6" />
    <Path d="M15 11l-2 -2" />
    <Path d="M11 7l-1.9 -1.9" />
    <Path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0" />
  </Svg>
);
export default SvgBrandGit;
