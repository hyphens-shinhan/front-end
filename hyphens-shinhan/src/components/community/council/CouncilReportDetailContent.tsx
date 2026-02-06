import FeedDetailContent from "../feed/FeedDetailContent";

interface CouncilReportDetailContentProps {
    postId: string;
}

/** 자치회 리포트 상세 페이지 클라이언트 컴포넌트
 * FeedDetailContent를 재사용하여 자치회 리포트 타입으로 전달
 * @param {CouncilReportDetailContentProps} props - postId 필요
 * @example
 * <CouncilReportDetailContent postId="abc-123" />
 */
export default function CouncilReportDetailContent({ postId }: CouncilReportDetailContentProps) {
    return <FeedDetailContent postId={postId} postType="council" />;
}
