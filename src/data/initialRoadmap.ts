import { Phase, Day } from '@/types/roadmap';
import { v4 as uuidv4 } from 'uuid';

export const initialPhases: Phase[] = [
  { id: 'phase-0', name: 'Phase 0 – Setup', description: 'Environment setup and prerequisites', startDay: 1, endDay: 1, order: 0 },
  { id: 'phase-1', name: 'Phase 1 – Linux', description: 'Master Linux fundamentals', startDay: 2, endDay: 30, order: 1 },
  { id: 'phase-2', name: 'Phase 2 – Networking', description: 'Network concepts and protocols', startDay: 31, endDay: 45, order: 2 },
  { id: 'phase-3', name: 'Phase 3 – AWS Mastery', description: 'Amazon Web Services deep dive', startDay: 46, endDay: 120, order: 3 },
  { id: 'phase-4', name: 'Phase 4 – DevOps', description: 'CI/CD, containers, and automation', startDay: 121, endDay: 160, order: 4 },
  { id: 'phase-5', name: 'Phase 5 – Projects', description: 'Real-world projects and portfolio', startDay: 161, endDay: 180, order: 5 },
];

const generateDaysForPhase = (phase: Phase): Day[] => {
  const days: Day[] = [];
  const dayTopics: Record<string, string[]> = {
    'phase-0': ['Environment Setup & Tools Installation'],
    'phase-1': Array.from({ length: 29 }, (_, i) => {
      const topics = ['Linux Basics & File System', 'Essential Commands', 'File Permissions', 'User Management', 'Process Management', 'Package Management', 'Shell Scripting Basics', 'Advanced Shell Scripting', 'Cron Jobs & Automation', 'System Monitoring', 'Log Management', 'Vim Mastery', 'SSH & Remote Access', 'Disk Management', 'Network Configuration', 'Firewall Basics', 'Service Management', 'Boot Process', 'Backup Strategies', 'Security Hardening', 'Performance Tuning', 'Troubleshooting', 'Docker on Linux', 'Kubernetes Basics', 'Ansible Introduction', 'Linux Projects Day 1', 'Linux Projects Day 2', 'Linux Review', 'Linux Assessment'];
      return topics[i] || `Linux Day ${i + 2}`;
    }),
    'phase-2': Array.from({ length: 15 }, (_, i) => {
      const topics = ['OSI Model', 'TCP/IP Stack', 'IP Addressing & Subnetting', 'DNS Deep Dive', 'HTTP/HTTPS', 'Load Balancing', 'CDN Concepts', 'VPN & Tunneling', 'Firewalls & Security Groups', 'Network Troubleshooting', 'Cloud Networking Basics', 'VPC Design', 'Route Tables & Gateways', 'Network Review', 'Network Assessment'];
      return topics[i] || `Networking Day ${i + 1}`;
    }),
    'phase-3': Array.from({ length: 75 }, (_, i) => {
      const topics = ['AWS Overview & IAM', 'EC2 Fundamentals', 'EC2 Advanced', 'EBS & Storage', 'S3 Basics', 'S3 Advanced', 'VPC Deep Dive', 'Route 53', 'CloudFront', 'RDS Basics', 'RDS Advanced', 'DynamoDB', 'Lambda Basics', 'Lambda Advanced', 'API Gateway', 'CloudWatch', 'CloudTrail', 'SNS & SQS', 'ECS Basics', 'ECS Advanced', 'EKS Introduction', 'EKS Deep Dive', 'Fargate', 'Elastic Beanstalk', 'CloudFormation Basics', 'CloudFormation Advanced', 'Terraform on AWS', 'AWS CLI Mastery', 'SDK & Boto3', 'Cost Optimization', 'Security Best Practices', 'Well-Architected Framework', 'High Availability Design', 'Disaster Recovery', 'Migration Strategies'];
      return topics[i] || `AWS Day ${i + 1}`;
    }),
    'phase-4': Array.from({ length: 40 }, (_, i) => {
      const topics = ['DevOps Culture', 'Git Advanced', 'GitHub Actions', 'Jenkins Basics', 'Jenkins Pipelines', 'Docker Deep Dive', 'Docker Compose', 'Kubernetes Architecture', 'K8s Deployments', 'K8s Services', 'K8s ConfigMaps & Secrets', 'Helm Charts', 'ArgoCD', 'Prometheus', 'Grafana', 'ELK Stack', 'Terraform Advanced', 'Ansible Playbooks', 'Infrastructure as Code', 'GitOps Practices'];
      return topics[i] || `DevOps Day ${i + 1}`;
    }),
    'phase-5': Array.from({ length: 20 }, (_, i) => {
      const topics = ['Project Planning', 'Architecture Design', 'Project 1: Static Website on S3', 'Project 2: EC2 Web Server', 'Project 3: Load Balanced App', 'Project 4: Serverless API', 'Project 5: Container App', 'Project 6: CI/CD Pipeline', 'Project 7: Monitoring Setup', 'Project 8: Infrastructure as Code', 'Project 9: Multi-Region Setup', 'Project 10: Full Stack Deploy', 'Portfolio Building', 'Documentation', 'Resume Projects', 'Interview Prep Day 1', 'Interview Prep Day 2', 'Mock Interviews', 'Final Review', 'Celebration & Next Steps'];
      return topics[i] || `Project Day ${i + 1}`;
    }),
  };

  const topics = dayTopics[phase.id] || [];
  for (let day = phase.startDay; day <= phase.endDay; day++) {
    const topicIndex = day - phase.startDay;
    days.push({
      id: `day-${day}`,
      phaseId: phase.id,
      dayNumber: day,
      title: topics[topicIndex] || `Day ${day}`,
      description: '',
      completed: false,
      notes: '',
    });
  }
  return days;
};

export const generateInitialDays = (): Day[] => {
  return initialPhases.flatMap(generateDaysForPhase);
};
