import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVacuumCleaner = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M12 16h.01" />
  </Svg>
);
export default SvgVacuumCleaner;
