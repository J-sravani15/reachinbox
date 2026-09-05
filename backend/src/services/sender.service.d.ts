export declare const createSender: (data: {
    userId: string;
    name: string;
    smtpEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    smtpEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    userId: string;
}>;
export declare const getSenders: (userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    smtpEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    userId: string;
}[]>;
export declare const deleteSender: (id: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    smtpEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    userId: string;
}>;
//# sourceMappingURL=sender.service.d.ts.map