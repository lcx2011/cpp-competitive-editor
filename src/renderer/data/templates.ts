export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const cppTemplates: CodeTemplate[] = [
  {
    id: 'basic',
    name: '基础模板',
    description: '最基本的C++程序结构',
    code: `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}`
  },
  {
    id: 'competitive',
    name: '竞赛模板',
    description: '包含常用头文件和宏定义的竞赛模板',
    code: `#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define pii pair<int, int>
#define vi vector<int>
#define vll vector<long long>
#define pb push_back
#define mp make_pair
#define fi first
#define se second
#define all(x) (x).begin(), (x).end()

const int MOD = 1e9 + 7;
const int INF = 1e9;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    
    
    return 0;
}`
  },
  {
    id: 'graph',
    name: '图论模板',
    description: '图论算法常用的数据结构和函数',
    code: `#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1e5 + 5;
vector<int> adj[MAXN];
bool visited[MAXN];
int dist[MAXN];

void dfs(int u) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v);
        }
    }
}

void bfs(int start) {
    queue<int> q;
    q.push(start);
    visited[start] = true;
    dist[start] = 0;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n, m;
    cin >> n >> m;
    
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    return 0;
}`
  },
  {
    id: 'dp',
    name: '动态规划模板',
    description: '动态规划常用结构',
    code: `#include <bits/stdc++.h>
using namespace std;

const int MAXN = 1005;
int dp[MAXN][MAXN];

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    cin >> n;
    
    // 初始化
    memset(dp, -1, sizeof(dp));
    
    // 边界条件
    dp[0][0] = 0;
    
    // 状态转移
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= i; j++) {
            // dp[i][j] = ...
        }
    }
    
    return 0;
}`
  },
  {
    id: 'math',
    name: '数学模板',
    description: '数学算法常用函数',
    code: `#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

ll gcd(ll a, ll b) {
    return b == 0 ? a : gcd(b, a % b);
}

ll lcm(ll a, ll b) {
    return a / gcd(a, b) * b;
}

ll power(ll base, ll exp, ll mod) {
    ll result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }
    return result;
}

bool isPrime(ll n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (ll i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    
    
    return 0;
}`
  }
];
