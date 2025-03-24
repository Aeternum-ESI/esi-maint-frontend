import { $fetch } from "@/app/actions/fetch";

const OverviewPage = async () => {
    const { error } = await $fetch("/auth/me");

    return <></>;
};
export default OverviewPage;
