import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChefHat = (props: SvgProps) => (
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
    <Path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151" />
    <Path d="M6.161 17.009l11.839 -.009" />
  </Svg>
);
export default SvgChefHat;
