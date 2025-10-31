import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

type WhitelistedUser = {
  id: string;
  address: string;
  name?: string;
  email?: string;
  addedAt: string;
  status: "active" | "suspended";
};

const whitelistedUsers: WhitelistedUser[] = [
  { id: "wl-1", address: "0x1234...5678", name: "Alice Johnson", email: "alice@example.com", addedAt: "2025-09-15", status: "active" },
  { id: "wl-2", address: "0xabcd...efgh", name: "Bob Smith", email: "bob@example.com", addedAt: "2025-09-20", status: "active" },
  { id: "wl-3", address: "0x9876...5432", name: "Charlie Brown", addedAt: "2025-10-01", status: "suspended" },
];

export default function WhitelistPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  return (
    <AppLayout>
      <PageHeader
        title="Whitelist"
        subtitle="Manage users who can receive attestations from your organization."
        actions={
          <Button variant="success" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add User"}
          </Button>
        }
      />

      {showAddForm && (
        <Card className="mb-6">
          <CardBody>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Add to Whitelist</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Wallet Address"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <Input label="Name (optional)" placeholder="John Doe" />
              <Input label="Email (optional)" placeholder="john@example.com" type="email" />
              <div className="sm:col-span-2">
                <Button variant="success" onClick={() => { setShowAddForm(false); setNewAddress(""); }}>
                  Add to Whitelist
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {whitelistedUsers.length === 0 ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
              No whitelisted users yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Added</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {whitelistedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50/70">
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900">{user.address}</td>
                      <td className="px-4 py-3 text-sm text-zinc-800">{user.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{user.email || "—"}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{new Date(user.addedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 " +
                            (user.status === "active"
                              ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                              : "bg-amber-100 text-amber-800 ring-amber-200")
                          }
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {user.status === "active" ? (
                            <Button variant="ghost" size="sm">Suspend</Button>
                          ) : (
                            <Button variant="ghost" size="sm">Activate</Button>
                          )}
                          <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </AppLayout>
  );
}

