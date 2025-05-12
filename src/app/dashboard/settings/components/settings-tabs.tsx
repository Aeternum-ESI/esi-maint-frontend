import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisplayProfessions } from "@/app/dashboard/users/technicians/components/display-professions";
import { DisplayCategories } from "@/app/dashboard/assets/components/display-categories";
import { AllUsers, ValidateUsers } from "@/app/dashboard/users/all/components/all-users";
import { DisplayTechnicians } from "@/app/dashboard/users/technicians/components/display-technicians";
import { User, Profession, Category, Technician } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Suspense } from "react";

export async function SettingsTabs() {
  // Fetch all data server-side
  let users: User[] = [];
  let professions: Profession[] = [];
  let categories: Category[] = [];
  let technicians: Technician[] = [];
  let pendingUsers: User[] = [];
  
  try {
    // Fetch users
    const usersResponse = await $fetch("users", {
      method: "GET",
      auth: await getToken(),
    });
    
    users = usersResponse.data?.data || [];
    
    // Filter pending users
    pendingUsers = users.filter(
      (user: User) => user.approvalStatus === "PENDING"
    );

    // Fetch professions
    const professionsResponse = await $fetch("professions", {
      method: "GET",
      auth: await getToken(),
    });
    
    professions = professionsResponse.data?.data || [];

    // Fetch categories
    const categoriesResponse = await $fetch("categories", {
      method: "GET",
      auth: await getToken(),
    });
    
    categories = categoriesResponse.data?.data || [];

    // Fetch technicians
    const techniciansResponse = await $fetch("technicians", {
      method: "GET",
      auth: await getToken(),
    });
    
    technicians = techniciansResponse.data?.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    // We'll continue with empty arrays for any failed requests
  }

  return (
    <Tabs defaultValue="users" className="space-y-4 ">
      <TabsList className="grid grid-cols-5 h-auto w-full">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        <TabsTrigger value="professions">Professions</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="technicians">Technicians</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="space-y-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="min-h-[400px] space-y-4">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-persian-green" />
            </div>
          }>
            <AllUsers users={users} />
          </Suspense>
        </div>
      </TabsContent>
      
      <TabsContent value="pending" className="space-y-4">
        <h2 className="text-2xl font-bold">Pending Approvals</h2>
        <div className="min-h-[400px]">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-persian-green" />
            </div>
          }>
            {pendingUsers.length > 0 ? (
              <ValidateUsers users={pendingUsers} />
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No pending approvals at this time.
              </div>
            )}
          </Suspense>
        </div>
      </TabsContent>
      
      <TabsContent value="professions" className="space-y-4">
        <h2 className="text-2xl font-bold">Profession Management</h2>
        <div className="min-h-[400px]">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-persian-green" />
            </div>
          }>
            <DisplayProfessions professions={professions} />
          </Suspense>
        </div>
      </TabsContent>
      
      <TabsContent value="categories" className="space-y-4">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <div className="min-h-[400px]">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-persian-green" />
            </div>
          }>
            <DisplayCategories categories={categories} />
          </Suspense>
        </div>
      </TabsContent>
      
      <TabsContent value="technicians" className="space-y-4">
        <h2 className="text-2xl font-bold">Technician Management</h2>
        <div className="min-h-[400px]">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-persian-green" />
            </div>
          }>
            <DisplayTechnicians technicians={technicians} professions={professions} />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
