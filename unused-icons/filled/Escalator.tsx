import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEscalator = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M19.5 4a3.5 3.5 0 0 1 0 7h-1.086l-8.12 8.121a3 3 0 0 1 -1.924 .872l-.198 .007h-3.672a3.5 3.5 0 0 1 0 -7h2.084l8.123 -8.121a3 3 0 0 1 1.923 -.872l.198 -.007z" />
  </Svg>
);
export default SvgEscalator;
