export interface RogResult {
    final_status: string;
    is_rog: number,
    log: Log
}

export interface Log {
    rule_outcome: string;
    reason: string,
    reason_value: string
}
