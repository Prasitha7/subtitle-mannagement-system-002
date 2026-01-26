
import { useEffect, useState } from "react";
import { userApi } from "../api/user-api";
import { UserProfile as UserProfileType } from "../types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
    FileText,
    Languages,
    HardDrive,
    Calendar,
    Clock,
    Activity
} from "lucide-react";

export default function UserProfile() {
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <p className="text-destructive">Failed to load profile data.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-5xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                    <AvatarFallback className="text-4xl">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{profile.username}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        {profile.roles.map(role => (
                            <Badge key={role} variant="secondary">
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hidden md:flex">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.stats.joinedDate).toLocaleDateString()}</span>
                </div>
            </div>

            <Separator />

            {/* Statistics Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Subtitles
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.stats.totalSubtitles}</div>
                        <p className="text-xs text-muted-foreground">
                            Uploaded or created
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Translations
                        </CardTitle>
                        <Languages className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.stats.totalTranslations}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed translations
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Storage Used
                        </CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.stats.storageUsedMb} MB</div>
                        <p className="text-xs text-muted-foreground">
                            Of 1GB quota
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Latest Activity
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">
                            Last seen just now
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
                <div className="grid gap-4">
                    {profile.recentActivity.map((activity) => (
                        <Card key={activity.id}>
                            <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${activity.action === 'created' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                                                activity.action === 'translated' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' :
                                                    'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
                                            }`}>
                                            {activity.action === 'created' && <FileText className="h-4 w-4" />}
                                            {activity.action === 'translated' && <Languages className="h-4 w-4" />}
                                            {activity.action === 'edited' && <FileText className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm leading-none">
                                                {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} <span className="font-bold">"{activity.title}"</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {new Date(activity.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
