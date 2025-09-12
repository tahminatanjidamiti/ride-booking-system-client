/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CancelConfirmation } from "@/components/CancelConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/Skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/redux/features/auth/auth.api";

export default function Users() {
  // local states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);

  // Build query params dynamically
  const queryParams: any = { page, limit };
  if (search) queryParams.search = search;
  if (role) queryParams.role = role;

  const { data, isLoading } = useGetUsersQuery(queryParams);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchText);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchText("");
    setRole(undefined);
    setPage(1);
  };

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  const totalPage = data?.meta?.totalPage || 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">Search</Button>
            {(searchText || role) && (
              <Button
                type="button"
                variant="outline"
                onClick={clearSearch}
              >
                Clear
              </Button>
            )}
          </form>

          {/* Role filter */}
          <Select
            value={role || "ALL"}
            onValueChange={(val) => {
              setRole(val === "ALL" ? undefined : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
              <SelectItem value="RIDER">Rider</SelectItem>
            </SelectContent>
          </Select>

          {/* Page size */}
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Verified</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length ? (
                data.data.map((user: any) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isVerified ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{user.address || ""}</td>
                    <td className="px-4 py-2">{user.phone || ""}</td>
                    <td className="px-4 py-2 text-center">
                      <CancelConfirmation
                        onConfirm={() => handleDelete(user._id)}
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </CancelConfirmation>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1} // disable only when page is first
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
              disabled={page === totalPage} // disable only when page is last
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}