/**
 * 客户类型
 */
export var CustomerLevel;
(function (CustomerLevel) {
    CustomerLevel["S"] = "S";
    CustomerLevel["A"] = "A";
    CustomerLevel["B"] = "B";
    CustomerLevel["C"] = "C";
})(CustomerLevel || (CustomerLevel = {}));
export var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["PROSPECT"] = "PROSPECT";
    CustomerStatus["SUPPORTING"] = "SUPPORTING";
    CustomerStatus["MAINTENANCE"] = "MAINTENANCE";
    CustomerStatus["COMPLETED"] = "COMPLETED";
    CustomerStatus["ARCHIVED"] = "ARCHIVED";
})(CustomerStatus || (CustomerStatus = {}));
/**
 * 项目类型
 */
export var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["URGENT"] = "URGENT";
})(Priority || (Priority = {}));
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["BACKLOG"] = "BACKLOG";
    ProjectStatus["TODO"] = "TODO";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["REVIEW"] = "REVIEW";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["BLOCKED"] = "BLOCKED";
    ProjectStatus["CANCELLED"] = "CANCELLED";
})(ProjectStatus || (ProjectStatus = {}));
export var Quadrant;
(function (Quadrant) {
    Quadrant["IMPORTANT_URGENT"] = "IMPORTANT_URGENT";
    Quadrant["IMPORTANT_NOT_URGENT"] = "IMPORTANT_NOT_URGENT";
    Quadrant["NOT_IMPORTANT_URGENT"] = "NOT_IMPORTANT_URGENT";
    Quadrant["NOT_IMPORTANT_NOT_URGENT"] = "NOT_IMPORTANT_NOT_URGENT";
})(Quadrant || (Quadrant = {}));
/**
 * 工作日志类型
 */
export var WorkType;
(function (WorkType) {
    WorkType["DEVELOPMENT"] = "DEVELOPMENT";
    WorkType["TESTING"] = "TESTING";
    WorkType["DOCUMENTATION"] = "DOCUMENTATION";
    WorkType["MEETING"] = "MEETING";
    WorkType["SUPPORT"] = "SUPPORT";
    WorkType["DEBUGGING"] = "DEBUGGING";
    WorkType["REVIEW"] = "REVIEW";
    WorkType["OTHER"] = "OTHER";
})(WorkType || (WorkType = {}));
