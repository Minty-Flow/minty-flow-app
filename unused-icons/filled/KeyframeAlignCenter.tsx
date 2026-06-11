import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgKeyframeAlignCenter = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v2a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 1 -1z" />
    <Path d="M12 6c-.629 0 -1.214 .301 -1.606 .807l-2.908 3.748a2.395 2.395 0 0 0 -.011 2.876l2.919 3.762c.39 .505 .977 .807 1.606 .807c.629 0 1.214 -.301 1.606 -.807l2.908 -3.748a2.395 2.395 0 0 0 .011 -2.876l-2.919 -3.762a2.032 2.032 0 0 0 -1.606 -.807z" />
    <Path d="M12 1a1 1 0 0 1 .993 .883l.007 .117v2a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 1 -1z" />
    <Path d="M5 11a1 1 0 0 1 .117 1.993l-.117 .007h-2a1 1 0 0 1 -.117 -1.993l.117 -.007h2z" />
    <Path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-2a1 1 0 0 1 -.117 -1.993l.117 -.007h2z" />
  </Svg>
);
export default SvgKeyframeAlignCenter;
