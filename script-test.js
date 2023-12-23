async function loadChatData() {
    //const response = await fetch('https://raw.githubusercontent.com/WeckerF/Line_Group_Analysis_2023/c3797620c969cd8f1c02d6b91b69a23af30826e4/for_GPT_read.csv');
    //const response = await fetch('https://raw.githubusercontent.com/WeckerF/Line_Group_Analysis_2023/main/for_GPT_read_test2.csv');
    const response = await fetch('./for_GPT_read_test_old.csv');
    const data = await response.text();
    //console.log(data);
    console.log(typeof data);
    const chatData = Papa.parse(data,{header: true});
    console.log(chatData)
    //const rows = data.split('\n');
    //console.log(rows);
    //const headers = rows[0].split(',');
  
/*
    const chatData = rows.slice(1).map(row => {
      const values = row.split(',');
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = values[index];
      });
      return rowObject;
    });*/
  
    //console.log(chatData);
    //console.log(typeof chatData);
    //console.log(chatData.data);

    console.log(typeof chatData.data[2]);
    const datak = chatData.data;

    let myArr = [];
    Object.values(datak).forEach(val => {
        myArr.push(val);
    });
    //console.log(myArr);
    console.log("print value of myArr");
    console.log(myArr[2]); 
    console.log(Object.values(myArr[2])[5]); 
    
    //print Member
    let all_member = [];
    myArr.forEach(val => {
        //console.log(Object.values(val)[5]);
        all_member.push(Object.values(val)[5]);
      });
    
    const uniques = [...new Set(all_member)];
    console.log(uniques);
    //const myData = myArr;

    visualizeMessageCountByDate(myArr);
    visualizeMessageCountByMember(myArr);
    visualizeMessageCountByDateAndMember(myArr);
    //visualizeMessageCountByTime(chatData);


    //const members = getUniqueMembers(chatData);
    //console.log(members); // Display the non-duplicate member values
    //console.log(chatData);

  }
  

  function visualizeMessageCountByDate(myArr) {
    const countsByDate = {};
    myArr.forEach(row => {
      const date = Object.values(row)[4];
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });
  
    const dates = Object.keys(countsByDate);
    const messageCounts = Object.values(countsByDate);
    console.log("print date");
    console.log(dates);
    console.log("print count");
    console.log(messageCounts);


    const ctx = document.getElementById('messageCountByDateChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Message Count',
            data: messageCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue color
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Message Count',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
  

  function visualizeMessageCountByMember(myArr) {
    const countsByMember = {};
    myArr.forEach(row => {
      const member = Object.values(row)[5]; // Get the value from the "Member" column directly
      //console.log(typeof member);
      if (member != undefined && !member.includes("收回訊息") && !member.includes("加入") && !member.includes("通話")&& !member.includes("移除")&& !member.includes("結束")){
        countsByMember[member] = (countsByMember[member] || 0) + 1;
      }

    });
  
    const members = Object.keys(countsByMember);
    const messageCounts = Object.values(countsByMember);
  
    console.log("Member" + members);
    console.log("count" + messageCounts);

    const ctx = document.getElementById('messageCountByMemberChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: members,
        datasets: [
          {
            label: 'Message Count',
            data: messageCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Green color
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Member',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Message Count',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
  
  /*
  function getUniqueMembers(chatData) {
    const uniqueMembers = new Set();
    chatData.forEach(row => {
      const member = row['Member']; // Trim whitespace, if needed
      uniqueMembers.add(member);
    });
    return Array.from(uniqueMembers);
  }
  */

    function visualizeMessageCountByDateAndMember(myArr) {
    const countsByDateAndMember = {};
  
    // Initialize counts for all members and dates as 0
    myArr.forEach(row => {
      const date = Object.values(row)[4];
      //const member = row['Member'];
      const member = Object.values(row)[5]; // Get the value from the "Member" column directly
      //console.log("Date - Member print: " + date + member);
      //console.log(typeof member);

      //const excludedWords = ['加入', '結束', '收回訊息','通話','移除'];
      const excludedWordsRegex = /加入|結束|收回|通話|移除/;
      if (!excludedWordsRegex.test(member)) {
        if (!countsByDateAndMember[date]) {
          countsByDateAndMember[date] = {};
        }
  
        countsByDateAndMember[date][member] = 0;
      }
      
    });
  
    // Calculate counts for each member and date
    myArr.forEach(row => {
      const date = Object.values(row)[4];
      const member = Object.values(row)[5];
      //const excludedWords = ['加入', '結束', '收回訊息','通話','移除'];
      const excludedWordsRegex = /加入|結束|收回|通話|移除/;
      if (!excludedWordsRegex.test(member)) {
        countsByDateAndMember[date][member]++;
      }
      //console.log(date, member, countsByDateAndMember[date][member]);
    });
  
    const dateLabels = Object.keys(countsByDateAndMember);
    console.log(dateLabels);
    console.log(Object.values(countsByDateAndMember));
    const memberCounts = {};
  
    // Prepare the member count data
    Object.values(countsByDateAndMember).forEach(memberData => {
      for (const member in memberData) {
        if (!memberCounts[member]) {
          memberCounts[member] = [];
        }
  
        const messageCount = memberData[member];
        memberCounts[member].push(messageCount);
      }
    });
  
    const ctx = document.getElementById('messageCountByDateAndMemberChart').getContext('2d');
    const members = Object.keys(memberCounts);
    const colors = generateColors(members.length);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: Object.keys(memberCounts).map((member, index) => ({
          label: member,
          data: memberCounts[member],
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Green color
          borderColor: colors[index % colors.length],
          borderWidth: 1,
        })),
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Message Count',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i / count) * 360;
      const color = `hsl(${hue}, 100%, 50%)`;
      colors.push(color);
    }
    return colors;
  }

  loadChatData();
