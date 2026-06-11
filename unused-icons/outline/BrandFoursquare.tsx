import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandFoursquare = (props: SvgProps) => (
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
    <Path d="M7 3h10c.644 0 1.11 .696 .978 1.33l-1.984 9.859a1.014 1.014 0 0 1 -1 .811h-2.254c-.308 0 -.6 .141 -.793 .382l-4.144 5.25c-.599 .752 -1.809 .331 -1.809 -.632v-16c0 -.564 .44 -1 1 -1l.006 0" />
    <Path d="M12 9l5 0" />
  </Svg>
);
export default SvgBrandFoursquare;
