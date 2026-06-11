import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLemon2 = (props: SvgProps) => (
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
    <Path d="M18 4a2 2 0 0 1 1.185 3.611c1.55 2.94 .873 6.917 -1.892 9.682c-2.765 2.765 -6.743 3.442 -9.682 1.892a2 2 0 1 1 -2.796 -2.796c-1.55 -2.94 -.873 -6.917 1.892 -9.682c2.765 -2.765 6.743 -3.442 9.682 -1.892a2 2 0 0 1 1.611 -.815" />
  </Svg>
);
export default SvgLemon2;
